"use client"

import { useState } from "react";

export function useLoading() {
    const [loading, setLoading] = useState(false);
    const withLoading = async (asyncFunc: () => Promise<void>) => {
        setLoading(true);
        try {
            await asyncFunc();
        } finally {
            setLoading(false);
        }   
    };
    return { loading, withLoading };
}
