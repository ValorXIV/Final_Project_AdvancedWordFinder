import word_solver
import util

word_list, anagram_dict = util.import_dict()

while(1):
    user_query = input("Enter your query (Q to quit): ")

    if user_query == "Q":
        break

    solver = word_solver.Solver()        
    if ":" in user_query:
        l_constraint, user_query = user_query.split(':', 1)
        user_query = user_query.strip()
        l_constraint = l_constraint.strip()
        min_length, max_length = solver.parse_length_constraint(l_constraint)
        current_wordlist = util.filter_len_word_list(min_length, max_length, word_list)

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
            word_id = util.create_word_id(a_constraint)
            for id in anagram_dict.keys():
                if solver.get_id_diff(id, word_id) <= wildcard_cnt:
                    for matching_word in anagram_dict[id]:
                        anag_ans.append(matching_word)
            print(anag_ans)
            

    matching_pattern = user_query
    current_wordlist = word_list
        
    results = solver.solve_single_query(matching_pattern, current_wordlist)

    if results:
        print(f"Matched words: ")
        for result in results:
            print(f"{result} ")
    else:
        print("No matching words.")