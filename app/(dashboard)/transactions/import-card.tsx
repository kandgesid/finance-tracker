import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse } from "date-fns";


const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
    "amount",
    "date",
    "payee"
];

interface SelectedColumnState {
    [key: string]: string | null;
};


type Props = {
    data: string[][];
    onCancle: () => void;
    onSubmit: (data: any) => void
}

export const ImportCard = ({
    data,
    onCancle,
    onSubmit
}:Props) => {
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({})
    
    const headers = data[0];
    const body = data.slice(1);
    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null,
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = {...prev};
            for(const key in newSelectedColumns){
                if(newSelectedColumns[key] === value){
                    newSelectedColumns[key] = null;
                }
            }

            if(value === "skip"){
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        });
    };

    const progress = Object.values(selectedColumns).filter(Boolean).length;

    const handleCotinue = () => {

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = index;
               return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = index;
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                });

                return transformedRow.every((item) => item ===null) ? []: transformedRow;
            }).filter((row) => row.length > 0)
        };

        const arrayOfData = mappedData.body.map((row) => {
            
            return row.reduce((acc: any, cell, index) => {
                const columnName = mappedData.headers[index];
                if(columnName !== null){
                    acc[columnName] = cell;
                }
                return acc;
            }, {})
        });

        const formattedData = arrayOfData.map((item) => ({
            ...item,
            amount: convertAmountToMiliunits(parseFloat(item["amount"])),
            date: format(parse(item["date"], dateFormat, new Date()), outputFormat)
        }));

        onSubmit(formattedData);
    };

    return (
        <div className="max-w-screen-2xl mx-auto w-full pd-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row 
                lg:justify-between lg:items-center">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transaction
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            size="sm" 
                            onClick={onCancle}
                            className="w-full lg:w-auto"
                        >
                            Cancle
                        </Button>
                        <Button
                            size="sm"
                            disabled={progress < requiredOptions.length}
                            onClick={handleCotinue}
                            className="w-full lg:w-auto"
                        >
                            Continue ({progress} / {requiredOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable 
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadSelectChange={onTableHeadSelectChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
}