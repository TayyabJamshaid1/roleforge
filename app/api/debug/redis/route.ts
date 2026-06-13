import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const keys = await redis.keys("*");

    const data = await Promise.all(
      keys.map(async (key) => {
        const type = await redis.type(key);

        let value: unknown = null;

        if (type === "string") {
          value = await redis.get(key);
        }

        if (type === "set") {
          value = await redis.smembers(key);
        }

        return {
          key,
          type,
          value,
        };
      })
    );

    return NextResponse.json({
      success: true,
      totalKeys: keys.length,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Redis debug failed",
      },
      { status: 500 }
    );
  }
}