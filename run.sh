#!/usr/bin/env bash
>output.txt
for ((i = 0; i < 100; i++)); do
    ts-node index.ts >> output.txt;
done;

echo "Average, Max, Min for Blind DFS (worst)" >> res.txt;
cat output.txt | awk '{if(min==""){min=max=$1}; if($1>max) {max=$1}; if($1<min) {min=$1}; total+=$1; count+=1} END {print total/count, max, min}' >> res.txt