import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Contact from '../components/Contact'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { id: 1 } })
  }
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  useInView: () => true,
  AnimatePresence: ({ children }) => children,
}))

// Mock useCursor
vi.mock('../contexts/CursorContext', () => ({
  useCursor: () => ({ setCursorType: vi.fn(), setCursorText: vi.fn() })
}))

describe('Contact Form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders form fields', () => {
    render(<Contact />)
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Message')).toBeInTheDocument()
    expect(screen.getByText('Send Message')).toBeInTheDocument()
  })

  it('shows country selector with flags', () => {
    render(<Contact />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    // Check Tanzania option exists
    const options = select.querySelectorAll('option')
    expect(options.length).toBeGreaterThan(0)
    const tzOption = Array.from(options).find(o => o.value === 'TZ')
    expect(tzOption).toBeTruthy()
    expect(tzOption.textContent).toContain('🇹🇿')
    expect(tzOption.textContent).toContain('+255')
  })

  it('validates required fields', async () => {
    render(<Contact />)
    fireEvent.click(screen.getByText('Send Message'))
    
    await waitFor(() => {
      expect(screen.getByText('Your Name')).toBeInTheDocument()
    })
    // Form validation is handled by browser, so we check the form doesn't submit
    const axios = await import('axios')
    expect(axios.default.post).not.toHaveBeenCalled()
  })

  it('formats phone with country code on submit', async () => {
    render(<Contact />)
    
    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Test Subject' } })
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '700000000' } })
    fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hello world' } })
    
    // Select Japan
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'JP' } })
    
    fireEvent.click(screen.getByText('Send Message'))
    
    await waitFor(() => {
      const axios = require('axios').default
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/contact/'),
        expect.objectContaining({
          phone: '+81700000000',
          country_code: 'JP'
        }),
        expect.any(Object)
      )
    })
  })

  it('shows success message on successful submit', async () => {
    render(<Contact />)
    
    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Test Subject' } })
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '700000000' } })
    fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hello world' } })
    
    fireEvent.click(screen.getByText('Send Message'))
    
    await waitFor(() => {
      expect(screen.getByText(/Message sent successfully/i)).toBeInTheDocument()
    })
  })
})
