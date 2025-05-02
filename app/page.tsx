"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useInfiniteQuery
} from "@tanstack/react-query";
import React, { useRef, useEffect, useCallback } from "react";


async function fetchData(limit: number, offset: number = 0): Promise<{ rows: string[]; nextOffset: number }> {
  const start = offset * limit;
  const rows = Array.from({ length: limit }, (_, i) => `Async loaded row ${start + i}`);
  await new Promise((r) => setTimeout(r, 500));
  return {
    rows,
    nextOffset: offset + 1,
  };
}

export default function Page() {
  const LIMIT = 20;
  const parentRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef(true);

  const scrollMetaRef = useRef<{
    prevScrollHeight: number;
    prevScrollTop: number;
  } | null>(null);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ['infiniteRows'],
    queryFn: ({ pageParam = 0 }) => fetchData(LIMIT, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    refetchOnWindowFocus: false,
  });


  const items = data?.pages.reverse().flatMap(page => page.rows).reverse() || [];

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });


  const loadMore = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || !parentRef.current) return;

    const el = parentRef.current;

    scrollMetaRef.current = {
      prevScrollHeight: el.scrollHeight,
      prevScrollTop: el.scrollTop,
    };

    await fetchNextPage();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])


  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    if (isInitialLoadRef.current && isSuccess && items.length > 0) {
      el.scrollTop = el.scrollHeight;
      isInitialLoadRef.current = false;
      return;
    }

    const meta = scrollMetaRef.current;
    if (meta) {
      el.scrollTop = el.scrollHeight - meta.prevScrollHeight + meta.prevScrollTop;
      scrollMetaRef.current = null;
    }
  }, [items.length, isSuccess]);


  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop <= 30 && !isFetchingNextPage && hasNextPage) {
        loadMore();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [loadMore, isFetchingNextPage, hasNextPage]);

  return (
    <div className="p-4">

      <div
        ref={parentRef}
        className="h-[50dvh] w-64 overflow-auto border rounded"
        style={{ position: "relative" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {isFetchingNextPage && (
            <div className="absolute top-0 left-0 w-full text-center text-sm text-gray-400 py-1">
              Loading...
            </div>
          )}

          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                // padding: "4px 8px",
                boxSizing: "border-box",
                borderBottom: "1px solid #eee",
                // background: virtualRow.index % 2 ? "#f9f9f9" : "#fff",
              }}
            >
              <div className="bg-blue-600 text-white p-4 rounded-md text-center">

                {items[virtualRow.index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}