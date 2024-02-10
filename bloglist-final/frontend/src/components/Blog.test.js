import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Blog />', () => {

  let increaseLikes
  let removeBlog
  let username

  beforeEach(() => {
    increaseLikes = jest.fn()
    removeBlog = jest.fn()
    username = 'test user'
  })

  test('renders title and author with no url or likes', () => {

    //const increaseLikes = jest.fn()
    //const removeBlog = jest.fn()
    //const username = 'test user'

    const blog = {
      title: 'testing title',
      author: 'SuperUser',
      user:{
        username: 'test user'
      }
    }

    const { container } = render(<Blog blog={blog} increaseLikes={increaseLikes} removeBlog={removeBlog} username={username}/>)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('testing title')

    expect(div).toHaveTextContent('SuperUser')
  })

  test('renders Url and number of likes after button to view them is clicked', async () => {
    //const increaseLikes = jest.fn()
    //const removeBlog = jest.fn()
    //const username = 'test user'

    const blog = {
      url: 'www.google.com',
      likes: 999,
      user:{
        username: 'test user'
      }
    }

    const { container } = render(<Blog blog={blog} increaseLikes={increaseLikes} removeBlog={removeBlog} username={username}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableContent')

    expect(div).not.toHaveStyle('display: none')

    expect(div).toHaveTextContent('www.google.com')

    expect(div).toHaveTextContent(999)

    //screen.debug()

  })

  test('like button is clicked twice', async () => {

    const blog = {
      title: 'testing like fnc',
      author: 'Tester',
      url: 'www.google.com',
      likes: 999,
      user:{
        username: 'test user'
      }
    }

    render(<Blog blog={blog} increaseLikes={increaseLikes} removeBlog={removeBlog} username={username}/>)

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(increaseLikes.mock.calls).toHaveLength(2)
  }
  )

})