import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();
        const res = await fetch(`${process.env.API_URL}/user`, {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        console.log(data);
        return NextResponse.json(data);
    } catch (message) {
        return NextResponse.json({ message });
    }
}
