const User = ({ userData }) => {
  if (!userData) {
    return null
  }
  return (
    <div>
      <h2>{userData.name}</h2>
      <b>added blogs</b>
      <ul>
        {userData.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
