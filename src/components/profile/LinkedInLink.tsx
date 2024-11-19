import React from 'react'
import { Button } from '../ui/button'

export function LinkedInLink() {
  const handleLinkClick = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}`
    const scope = 'r_liteprofile r_emailaddress w_member_social'
    const state = 'random_string' // Use a secure random string

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`

    window.location.href = authUrl
  }

  return (
    <Button onClick={handleLinkClick} className="btn-linkedin">
      Link LinkedIn Account
    </Button>
  )
}
