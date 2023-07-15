const prisma = require("../prisma");

exports.createPost = async (req, res) => {
  try {
    const { slug, title, body } = req.body;

    if (!slug || !title || !body)
      return res
        .status(400)
        .json({ success: false, message: "Please Provide all fields" });

    const isSlugExist = await prisma.post.findFirst({
      where: {
        slug,
      },
    });

    if (isSlugExist)
      return res.status(409).json({
        success: false,
        message: "Slug Already in Use",
      });

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        body,
        author: {
          connect: {
            id: req.user.id,
          },
        },
      },
      include: {
        author: true, // eager load the related comment records for this new Post record created by current user
      },
    });

    // delete post?.author?.password;

    return res
      .status(201)
      .json({ success: true, message: "Created successfully!", post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.allPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        }, // eager load the related comment records for this new Post record created by current user
      },
    });

    return res.status(200).json({
      success: true,
      message: posts.length <= 0 && "No Posts Found",
      posts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    let slug = req.params["slug"];

    const post = await prisma.post.findFirst({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        }, // eager load the related comment records for this new Post record created by current user
      },
    });
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not Found" });

    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Post not Found" });
  }
};

exports.getPostByAuthor = async (req, res) => {
  try {
    let { q } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        author: {
          is: {
            email: q,
          },
        },
      },
    });

    // const authorsPosts = await prisma.user.findUnique({
    //   where: { email },
    //   include: {
    //     posts: true,
    //   },
    // });

    if (posts.length <= 0)
      return res.status(200).json({
        success: false,
        message: q + " has made any posts",
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let { slug } = req.params;

    const post = await prisma.post.update({
      where: {
        slug,
        author: {
          email: req.user.email,
        },
      },
      data: { ...req.body },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Post Updated Successfully", post });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Updating Post",
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    let { slug } = req.params;

    const post = await prisma.post.delete({
      where: {
        slug,
        author: {
          email: req.user.email,
        },
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Post Deleted Successfully" });
  } catch (error) {
    first;
    return res.status(500).json({
      success: false,
      message: "Error in Deleting Post",
    });
  }
};
