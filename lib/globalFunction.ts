import { NextResponse } from "next/server";

function unauthorizeResponse() {
  return NextResponse.json({ message: "Unauthorize Request" }, { status: 401 });
}

function errorResponse(error: string, code: number = 400) {
  return NextResponse.json(
    { message: error ? error : "Something Wrong" },
    { status: code }
  );
}

function successResponse() {
  return NextResponse.json({ success: true }, { status: 200 });
}

function dataResponse(payload: any) {
  return NextResponse.json(payload);
}

export { unauthorizeResponse, dataResponse, errorResponse, successResponse };
