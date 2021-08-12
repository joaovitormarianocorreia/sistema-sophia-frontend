import { ButtonWrapper } from './styles'

const Button = ({
  type = 'button',
  className = 'default',
  onClick = undefined,
  children,
}) => {
  return (
    <ButtonWrapper type={type} className={className} onClick={onClick}>
      {children}
    </ButtonWrapper>
  )
}

export default Button
