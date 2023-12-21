# Found on zeus-med server
# Unsolved as of yet
import itertools


values = [1,2,3,4,5,6,7,9,10,12,13]

count = 0
for r in range(0, 125):
    combinations = itertools.combinations_with_replacement(values, r)
    for item in combinations:
        sum_item = sum(item)
        if sum_item == 122:
            # print(f'combination: {item} -> {sum(item)}')
            count += 1

print(f'Result: {count}')
