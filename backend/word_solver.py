import regex
from collections import defaultdict
from typing import Tuple

class Solver():

    def query_parser(self, pattern: str) -> str:

        variable_dict = set()
        regex_pattern = f""

        for i in range(len(pattern)):
            if(pattern[i].isupper()): #variable A,B,C etc.
                var = pattern[i]
                if var not in variable_dict: #save variable into dict
                    regex_pattern += f"(?P<{var}>.+)" 
                    variable_dict.add(var)
                else:
                    regex_pattern += f"(?P={var})"
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

    def solve_single_query(self, pattern: str, word_list: list[str]) -> list[str]:

        word_list = set(word_list)
        rex = self.query_parser(pattern)
        compiled_regex = regex.compile(rex)
        matching_words = []
        for word in word_list:
            if compiled_regex.fullmatch(word):
                matching_words.append(word)

        return matching_words

    def solve_multi_query(self, pattern: str, word_list: list[str]) -> list[list[str]]:

        sub_pattern = pattern.split(";")
        sub_pattern = [w.strip() for w in sub_pattern]
        query_count = len(sub_pattern)

        matching_word = []

        variable_value = defaultdict(lambda: [None] * query_count)

        for i, p in enumerate(sub_pattern):
            rex = self.query_parser(p)
            compiled_regex = regex.compile(rex)
            for word in word_list:
                matching = compiled_regex.fullmatch(word)
                if matching:
                    mg = matching.groups()
                    variable_value[mg][i] = word
        
        for key, value in variable_value.items():
            if all(v is not None for v in value):
                # print(key, value)
                matching_word.append(value)
    
        return matching_word
                
    def parse_length_constraint(self, constraint: str) -> Tuple[int, int]:
        
        min_len, max_len = 1, float("inf")
        
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

    def get_id_diff(self, base_id: tuple, target_id: tuple) -> int:
        diff = 0
        for b_cnt, t_cnt in zip(base_id, target_id):
            res = b_cnt - t_cnt
            if res < 0:
                return float('-inf')
            diff += res
        return diff

import util
word_list, anagram_dict = util.import_dict()
s = Solver()
w = s.solve_multi_query("AaB;AiB", word_list)
# for i in w:
#     for j in i:
#         print(j,end=' ')
#     print()

# w = s.solve_single_query("4:l*/tale.", word_list)
# for ws in w:
#     print(ws)
# print(len(w))