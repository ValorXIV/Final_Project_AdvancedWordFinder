import word_solver
import util

def handle_query(user_query, word_list, anagram_dict):

    current_word_list = word_list
    solver = word_solver.Solver()
    min_length = 1
    max_length = float("inf")

    if ":" in user_query:
        length_constraint, user_query = user_query.split(':', 1)
        user_query = user_query.strip()
        length_constraint = length_constraint.strip()
        min_length, max_length = solver.parse_length_constraint(length_constraint)

    if "/" in user_query: 
        anagram_ans = []
        user_query, anagram_constraint = user_query.split('/', 1)
        user_query = user_query.strip()
        anagram_constraint = anagram_constraint.strip()
        if '*' in anagram_constraint:
            wildcard_cnt = float("inf")
        else: 
            wildcard_cnt = anagram_constraint.count('.')
            anagram_constraint = anagram_constraint.replace('.','').replace('*','')
            word_id = util.create_word_id(anagram_constraint)
            for id in anagram_dict.keys():
                if solver.get_id_diff(id, word_id) <= wildcard_cnt:
                    for matching_word in anagram_dict[id]:
                        anagram_ans.append(matching_word)
        current_word_list = anagram_ans

    matching_pattern = user_query
    current_wordlist = util.filter_len_word_list(min_length, max_length, current_word_list)

    if matching_pattern:
        results = solver.solve_single_query(matching_pattern, current_wordlist)
    else:
        results = anagram_ans
        
    return results