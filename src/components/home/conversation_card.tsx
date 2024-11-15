import { useRouter } from "next/navigation"
import { FC } from "react"

interface IProps {
  data: any,
}

const ConversationCard: FC<IProps> = ({ data }: IProps) => {
  console.log(data)
  const router = useRouter()
  return (
    <div className="w-full h-max min-h-26 bg-white border border-[#eeeeee] shadow-md rounded-md px-6 py-4 flex flex-col hover:cursor-pointer"
      onClick={() => { router.push(`/conversation?id=${data.id}`) }}>
      <span className="text-lg font-semibold">{data.name}</span>
      <span className="text-xs py-2 text-[#6c6c6c]">{data.createdDate.toLocaleString()}</span>
      <span>{data.type === 1 ? "File record" : ""}</span>
    </div>
  )
}

export default ConversationCard
