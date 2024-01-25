// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Form from './Todos/Form'
import userEvent from '@testing-library/user-event'

it('Click Form submit button', async () => {
  const mockCreate = jest.fn()
  render(<Form createTodo={mockCreate} />)

  //const user = userEvent.setup()
  const button = screen.getByText('Submit')
  const input = screen.getByRole('textbox')

  await userEvent.type(input, 'testing')
  await userEvent.click(button)

  expect(mockCreate.mock.calls).toHaveLength(1)
  expect(mockCreate.mock.calls[0][0].text).toBe('testing')
})
