export interface Source {
  year: number
  authors: string[]
  name: string
  type: string
  href: {
    isbn_13?: string
    isbn_10?: string
    direct_url?: string
    journal?: string
    pages?: string
    publisher?: string
    year?: number
    volume?: string
    number?: string
  }
}
