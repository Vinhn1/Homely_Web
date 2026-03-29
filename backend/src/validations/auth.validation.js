import z from 'zod';

export const signUpSchema = z.object({
    username: z.string().min(3, "Username quá ngắn").max(20).trim(),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    firstName: z.string().min(1, "Họ và tên không được để trống"),
    lastName: z.string().min(1, "Họ và tên không được để trống")
})


export const signInSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập tài khoản"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự")
})