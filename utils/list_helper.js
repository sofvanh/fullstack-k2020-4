const totalLikes = (blogs) => {
    return (blogs.reduce((total, blog) => total + blog.likes, 0))
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return (blogs.reduce((oldFave, blog) => {
        if (oldFave === null) return (blog)
        else {
            if (blog.likes > oldFave.likes) return blog
            else return oldFave
        }
    }))
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;
    var map = {}
    var max = blogs[0].author
    var maxCount = 1
    for (var i = 0; i < blogs.length; i++) {
        const author = blogs[i].author
        if (map[author] == null) map[author] = 1
        else map[author]++
        if (map[author] > maxCount) {
            max = author
            maxCount = map[author]
        }
    }
    return {
        author: max,
        blogs: maxCount
    }
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs
}