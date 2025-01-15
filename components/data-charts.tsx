"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { Chart, ChartsLoading,  } from "./charts";
import { SpendingPie, SpendingPieLoading } from "./spending-pie";

export const DataCharts = () => {
    const {data, isLoading} = useGetSummary();

    if(isLoading){
        return (
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                    <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                        <ChartsLoading />
                    </div>
                    <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                        <SpendingPieLoading/>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Chart data={data?.days}/>
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <SpendingPie data={data?.categories}/>
            </div>
        </div>
    );
} 