import { useEffect, useState } from "react"
import { Futbolista, FutbolistaKey, Response } from "../interfaces/response";
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const headers: { label: string, key: FutbolistaKey }[] = [
    {
        label: 'Id',
        key: 'id'
    },
    {
        label: 'Nombres',
        key: 'nombres'
    },
    {
        label: 'Apellidos',
        key: 'apellidos'
    },
    {
        label: 'Fecha de Nacimiento',
        key: 'fechaNacimiento'
    },
    {
        label: 'Características',
        key: 'caracteristicas'
    },
    {
        label: 'Posición',
        key: 'posicion'
    },
];

const sizes = [5, 10, 15, 20];

const fetchFubolistaId = async (id: number) => {
    const futbolista: Futbolista = await fetch(`http://localhost:8080/futbolista/${id}`).then(res => res.json());
    const message = `El futbolista con nombre ${futbolista.nombres} tiene el id ${id} y juega de ${futbolista.posicion}`
    return message;
}

export const Table = () => {


    const [data, setData] = useState<Response | undefined>();
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const onSetSize = (size: number) => {
        setSize(size)
        setPage(0)
        setIsOpen(false);
    }

    useEffect(() => {
        fetch(`http://localhost:8080/futbolista?size=${size}&page=${page}`)
            .then(res => res.json())
            .then((data: Response) => {
                setData(data)
            })
            .catch(error => 
                console.error("Error fetching data: ", error)
            )
    }, [size, page])

    return (
        <>
            <div className="flex flex-col m-5 rounded-lg shadow overflow-auto scrollbar scrollbar-thumb-stone-300 max-h-[490px]">
                <table>
                    <thead className="bg-gray-300 border-b-2 border-gray-800">
                        <tr>
                            {
                                headers.map((header, index) => (
                                    <th className="p-3 text-sm font-semibold tracking-wide text-left w-28" key={index}>
                                        <span>{header.label}</span>
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.futbolistas.map((futbolista) => (
                                <tr className="hover:bg-slate-100" key={futbolista.id}>
                                    {
                                        headers.map((header, index) => {
                                            return (
                                                <td
                                                    className="p-3 text-sm text-gray-700" key={index}
                                                    onClick={async () => alert(await fetchFubolistaId(futbolista.id))}>
                                                    {(futbolista[header.key]).toLocaleString()}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center align-middle gap-2">
                <button
                    onClick={() => setPage(0)}
                    disabled={data?.first}
                    className="p-1 font-bold text-lg rounded-lg tracking-wide border-2 active:border-black duration-300 max-h-[42px] disabled:bg-gray-500">
                    <AiOutlineDoubleLeft />
                </button>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={data?.first}
                    className="p-1 font-bold text-lg rounded-lg tracking-wide border-2 active:border-black duration-300 max-h-[42px] disabled:bg-gray-500">
                    <AiOutlineLeft />
                </button>
                <div className="relative flex flex-col items-center w-24 rounded-lg">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 w-full flex items-center justify-between font-bold text-lg rounded-lg tracking-wide border-2 active:border-black duration-300">
                        {size}
                        {
                            !isOpen
                                ? <AiOutlineCaretDown className="h-8" />
                                : <AiOutlineCaretUp className="h-8" />
                        }
                    </button>
                    {
                        isOpen &&
                        <div className="overflow-y-auto max-h-14 w-full rounded scrollbar-thin scrollbar-corner-rose-500">
                            {
                                sizes.map(size => (
                                    <div
                                        className="p-1 hover:bg-gray-300"
                                        onClick={
                                            () => onSetSize(size)
                                        }
                                        key={size}>
                                        <h3>{size}</h3>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={data?.last}
                    className="p-1 font-bold text-lg rounded-lg tracking-wide border-2 active:border-black duration-300 max-h-[42px] disabled:bg-gray-500">
                    <AiOutlineRight />
                </button>
                <button
                    onClick={() => setPage(data ? data.totalPages - 1 : 0)}
                    disabled={data?.last}
                    className="p-1 font-bold text-lg rounded-lg tracking-wide border-2 active:border-black duration-300 max-h-[42px] disabled:bg-gray-500">
                    <AiOutlineDoubleRight />
                </button>
            </div>

        </>
    )
}
