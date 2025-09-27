import Link from 'next/link';
import React from 'react';
interface Props {
    title: string,
    url?: string
}
const Heading = ({title, url}: Props) => {
    return (
        <div className='flex items-center justify-between mb-3'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            {url && <Link href={url} className='text-sm font-semibold text-blue-500'>Xem tất cả</Link>}
        </div>
    );
};

export default Heading;