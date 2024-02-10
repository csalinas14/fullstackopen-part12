const SingleForm = ({ name, value, handleChange }) => {
  //console.log(name)
  return (
    <div>
      <b>{name + ' '}</b>
      <input
        id={'blogForm' + name}
        type="text"
        value={value}
        name={name}
        onChange={({ target }) => handleChange(target.value)}
        placeholder={'write blog ' + name + ' here'}
      />
    </div>
  )
}

export default SingleForm
