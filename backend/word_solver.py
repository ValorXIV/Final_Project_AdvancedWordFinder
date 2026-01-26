import re
from collections import defaultdict

class Solver():

    def query_parser(self, pattern: str) -> str:

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

    def solve_single_query(self, pattern: str, word_list: list[str]) -> list[str]:

        regex = self.query_parser(pattern)
        matching_words = []
        compiled_regex = re.compile(regex)

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
            regex = self.query_parser(p)
            compiled_regex = re.compile(regex)
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
                

    def parse_length_constraint(self, constraint: str):
        
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
                return float("inf")
            diff += res
        return diff

# import util
# word_list, anagram_dict = util.import_dict()
# s = Solver()
# w = s.solve_multi_query("ABC;AeB", word_list)
# for i in w:
#     for j in i:
#         print(j,end=' ')
#     print()