import {SignUp} from '@clerk/nextjs'

const SignUpPage = () => (
  <SignUp afterSignInUrl="/sign-up" redirectUrl="/sign-up" />
)

export default SignUpPage