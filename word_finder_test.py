import re
from typing import List
from collections import defaultdict

def query_parser(pattern: str) -> str:

    variable_dict = defaultdict(int)
    variable_count = 0
    regex_pattern = f""

    for i in range(len(pattern)):
        if(pattern[i].isupper()): #variable A,B,C etc.
            var = pattern[i]
            if var not in variable_dict: #save variable into dict and assign group number
                variable_count += 1
                regex_pattern += "(.+)"
                variable_dict[var] = variable_count
            else:
                regex_pattern += f"\\{variable_dict[var]}"
        elif(pattern[i] == "*"):
            regex_pattern += ".*"
        elif(pattern[i] == "#"):
            regex_pattern += "[^aeiou]"
        elif(pattern[i] == "@"):
            regex_pattern += "[aeiou]"
        else:
            regex_pattern += pattern[i]
    
    start_with_wildcard = pattern.startswith('*')
    end_with_wildcard = pattern.endswith('*')

    if not start_with_wildcard:
        regex_pattern = "^" + regex_pattern
    
    if not end_with_wildcard:
        regex_pattern = regex_pattern + "$"

    return regex_pattern

def find_matches(pattern: str, word_list: List[str]) -> List[str]:

    regex = query_parser(pattern)
    print(f"Converted pattern '{pattern}' to regex: {regex}")

    matching_words = []

    compiled_regex = re.compile(regex)

    for word in word_list:
        if compiled_regex.fullmatch(word):
            matching_words.append(word)

    return matching_words

def parse_length_constraint(constraint: str):
    
    min_len, max_len = 1, 100
    
    if '-' not in constraint: #(6 -> exact 6 char)
        min_len = int(constraint)
        max_len = int(constraint)
    elif constraint.startswith('-'): #(-6 -> max 6 char)
        max_len = int(constraint[1:])
    elif constraint.endswith('-'): #(6- -> min 6 char)
        min_len = int(constraint[:-1])
    else: #(6-9)
        min_n, max_n = constraint.split('-', 1)
        min_len = int(min_n)
        max_len = int(max_n)
    
    return min_len, max_len

def filter_len_word_list(min_length: int, max_length: int, word_list:List[str]) -> List[str]:
    filtered_list = [
        word for word in word_list if min_length <= len(word) <= max_length
    ]
    return filtered_list

def clean_word_list(word_list: List[str]) -> List[str]:
    cleaned_list = []
    for word in word_list:
        cleaned_word = "".join(char for char in word if char.isalpha()).lower()
        cleaned_list.append(cleaned_word)
    return cleaned_list

def create_word_id(word: str) -> tuple:
    word_id = [0] * 26
    for letter in word:
        l_order = ord(letter) - ord('a')
        word_id[l_order] += 1
    word_id = tuple(word_id)
    return word_id

def create_anagram_dict(word_list: List[str]) -> dict[tuple, list[str]]:
    anag_dict = defaultdict(list)
    for word in word_list:
        word_id = create_word_id(word)
        anag_dict[word_id].append(word)
    return anag_dict

def import_dict():
    word_dict = input("Enter your dict file name: ")

    if(word_dict):
        with open(word_dict) as d:
            word_list = d.read().splitlines()
    
    word_list = clean_word_list(word_list)
    anagram_dict = create_anagram_dict(word_list)
    return word_list, anagram_dict

def get_id_diff(base_id: tuple, target_id: tuple) -> int:
    diff = 0
    for b_cnt, t_cnt in zip(base_id, target_id):
        res = b_cnt - t_cnt
        if res < 0:
            return 100000
        diff += res
    return diff
    
if __name__ == "__main__":
    
    word_list, anagram_dict = import_dict()

    while(1):
        user_query = input("Enter your query (Q to quit): ")

        if user_query == "Q":
            break
        
        if ":" in user_query:
            l_constraint, user_query = user_query.split(':', 1)
            user_query = user_query.strip()
            l_constraint = l_constraint.strip()
            min_length, max_length = parse_length_constraint(l_constraint)
            current_wordlist = filter_len_word_list(min_length, max_length, word_list)

        if "/" in user_query: #unfinished part
            anag_ans = []
            user_query, a_constraint = user_query.split('/', 1)
            user_query = user_query.strip()
            a_constraint = a_constraint.strip()
            if '*' in a_constraint:
                wildcard_cnt = 1000
            else: 
                wildcard_cnt = a_constraint.count('.')
            a_constraint = a_constraint.replace('.','').replace('*','')
            word_id = create_word_id(a_constraint)
            for id in anagram_dict.keys():
                if get_id_diff(id, word_id) <= wildcard_cnt:
                    for matching_word in anagram_dict[id]:
                        anag_ans.append(matching_word)
            print(anag_ans)
            

        matching_pattern = user_query
        current_wordlist = word_list
        
        results = find_matches(matching_pattern, current_wordlist)

        if results:
            print(f"Matched words: ")
            for result in results:
                print(f"{result} ")
        else:
            print("No matching words.")