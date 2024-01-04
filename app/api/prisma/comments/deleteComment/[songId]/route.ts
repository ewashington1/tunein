import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function DELETE(
    req: NextRequest,
    { params }: { params: {songId: string}}
) {
    try {
        const session = await getServerSession(authOptions);
        const songId = params.songId;        
        await prisma.comment.delete({
            where: { songId_userId: {songId, userId: session!.user!.id}},
        });
        return NextResponse.json({ message: "Comment deleted!" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { errors: "Comment couldn't be deleted."} ,
            { status: 500 }
        )
    } 
}