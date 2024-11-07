'use client'

import { FC, Fragment, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import cn from 'classnames'
import { LineConfig } from "@ant-design/plots"
import ChartSkeleton from "@/components/Skeletons/ChartSkeleton"

const Line = dynamic(() => import('@ant-design/plots').then((m) => m.Line), { ssr: false })
interface IProps {
  className?: string
}

const ExampleChart: FC<IProps> = ({ className }) => {
  const chartHeight = 240
  const [isReady, setIsReady] = useState<boolean>(false)
  const chartComp = useMemo(() => {
    const datas = [
      { label: "Value1", value: 10 },
      { label: "Value2", value: 8 },
      { label: "Value3", value: 5 },
    ]
    const config: LineConfig = {
      data: datas,
      xField: 'label',
      yField: 'value',
      autoFit: true,
      height: 240,
      onReady() {
        setIsReady(true)
      },
    }

    return <div className={`w-full h-[${240}px] relative`}>
      {!isReady && <ChartSkeleton className={cn(
        "w-full h-full",
        "absolute top-[50%] left-[50%]",
        "-translate-x-1/2 -translate-y-1/2"
      )} />}
      <div className={cn("w-full h-full", {
        "opacity-0": !isReady,
        "opacity-1": isReady
      })}>
        <Line {...config} />
      </div>
    </div>
  }, [isReady])
  return <div className={cn(className)}>
    <Fragment>
      {chartComp}
    </Fragment>
  </div>
}

export default ExampleChart
