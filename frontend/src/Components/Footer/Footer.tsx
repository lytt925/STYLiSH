import FooterXL from './Footer-xl'
import FooterMD from './Footer-md'

const Footer = () => {

  const footerLinks = [
    '關於Stylish',
    '服務條款',
    '隱私政策',
    '聯絡我們',
    'FAQ'
  ]

  return (
    <>
      <FooterXL footerLinks={footerLinks} />
      <FooterMD footerLinks={footerLinks} />
    </>
  )
}

export default Footer