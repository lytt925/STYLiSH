import socialMediaImages from './img';

const Footer = ({ footerLinks }: { footerLinks: string[] }) => {
  return (
    <footer className="hidden xl:flex justify-center bg-[#313538] h-[115px] text-center items-center text-white">
      <div className="w-5/12 flex justify-between items-center">
        {footerLinks.map((link, index) => {
          const borderStyle = index !== footerLinks.length - 1 ? 'border-solid border-r-[1px] border-white' : '';
          return <div key={index} className={`w-1/5 h-[16px] flex justify-center items-center text-[16px] ${borderStyle}`}><p className='leading-[22px]'>{link}</p></div>
        })
        }
      </div>
      <div className="flex">
        {
          socialMediaImages.map((image, index) => {
            return (
              <div key={index}>
                <img src={image} alt="Cart" className="h-12 w-12 ml-8" />
              </div>
            )
          })
        }
        <div className='text-[12px] text-[#828282] flex items-center justify-center ml-8'><p>© 2018 All Rights Reserved.</p></div>
      </div>
    </footer >
  )
}

export default Footer
