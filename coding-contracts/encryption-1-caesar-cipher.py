input_string = "POPUP LOGIN FRAME DEBUG LOGIC"
input_values = input_string.split(' ')

left_lag_amount = 12

alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

output_values = []
for word in input_values:
    print(f'word: {word}')

    answer = []
    for letter in word:
        index = alphabet.index(letter)
        solution_index = index - left_lag_amount
        if solution_index<0:
            solution_index += 26
        solution_letter = alphabet[solution_index]
        print(f'letter: {letter}\tsolution letter: {solution_letter}\tsolution letter: {solution_letter}')

        answer.append(solution_letter)

    output_values.append(''.join(answer))

output_string = ' '.join(output_values)
print(f'solution: {output_string}')
