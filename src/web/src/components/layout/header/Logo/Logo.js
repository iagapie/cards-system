import { Link } from 'react-router-dom'

import { LogoContainer, LogoText } from '@/components/layout/header/Logo/Logo.styles'
import { appName, routes } from '@/utils/constants'

export const Logo = () => (
  <LogoContainer>
    <LogoText>
      <Link to={routes.root}>{appName.short}</Link>
    </LogoText>
  </LogoContainer>
)
