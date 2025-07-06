"use server"
export const HandleCreateDestination = async (data: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(data)
    })
}
