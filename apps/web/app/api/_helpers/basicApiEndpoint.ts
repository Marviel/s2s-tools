import { NextResponse } from 'next/server';

export function basicApiEndpoint(fn: (req: Request) => Promise<any>) {
    return async (req: Request) => {
        try {
            return await fn(req)
        } catch (error) {

            console.log('error', error)
            // You can do different error-related things here.
            return NextResponse.json({
                error: JSON.stringify(error)
            }, {
                status: 500
            })
        }
    }
}