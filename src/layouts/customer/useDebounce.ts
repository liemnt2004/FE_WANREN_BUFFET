import { useState, useEffect } from "react";


const useDebounce = <T,>(value: T, delay: number = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Tạo một timer để cập nhật debouncedValue sau khi delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Dọn dẹp timer nếu giá trị thay đổi trước khi delay kết thúc
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Chạy effect mỗi khi value hoặc delay thay đổi

    return debouncedValue;
};

export default useDebounce;
