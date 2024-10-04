const Blog = require('../model/blog.model');


const createblog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
};


const getblog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send();
    res.status(200).send(blog);
  } catch (error) {
    res.status(500).send(error);
  }
};


const updateblog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).send();
    res.status(200).send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
};


const deleteblog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).send();
    res.status(200).send(blog);
  } catch (error) {
    res.status(500).send(error);
  }
};


const getAllblog = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send(error);
  }
};



module.exports = {

  createblog,
  getblog,
  updateblog,
  deleteblog,
  getAllblog,

};
