import { useState } from 'react'
import MemberImage from '../../../assets/img/member.png';
import MemberImageHover from '../../../assets/img/member-hover.png';

const MemberXl = () => {
  const [isMemberHovered, setIsMemberHovered] = useState(false);
  return (
    <button onMouseEnter={() => setIsMemberHovered(true)} onMouseLeave={() => setIsMemberHovered(false)}>
      <img src={isMemberHovered ? MemberImageHover : MemberImage} alt="MemberButton" className="h-11 w-11 hover:cursor-pointe" />
    </button>
  )
}

export default MemberXl
