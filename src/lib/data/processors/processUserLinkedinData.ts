import { LinkedInProfileType, UGCPostsResponse } from '@/schemas/linkedin'

type Props = {
  profile: LinkedInProfileType
  posts: UGCPostsResponse
  likedPosts: UGCPostsResponse
}

export function processUserLinkedinData({ profile, posts, likedPosts }: Props) {
  console.log(profile, posts, likedPosts)
}
