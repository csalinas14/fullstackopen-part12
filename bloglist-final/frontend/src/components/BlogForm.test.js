import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  //const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)

  const inputTitle = screen.getByPlaceholderText('write blog Title here')
  const inputAuthor = screen.getByPlaceholderText('write blog Author here')
  const inputUrl = screen.getByPlaceholderText('write blog Url here')
  const submitButton = screen.getByText('create')

  await userEvent.type(inputTitle, 'testing a form title...')
  await userEvent.type(inputAuthor, 'testing a form author...')
  await userEvent.type(inputUrl, 'testing a form url...')
  await userEvent.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a form author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a form url...')

  //screen.debug()
})