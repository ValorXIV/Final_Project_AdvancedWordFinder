from collections import defaultdict

import os

def import_dict(filename="UKACD.txt"):
    # If the filename does not already contain the path, prepend it
    if "dictionary" not in filename:
        filename = os.path.join(os.path.dirname(__file__), "dictionary", filename)
    
    try:
        with open(filename) as d:
            word_list = d.read().splitlines()
    except FileNotFoundError:
        print(f"File {filename} not found.")
        word_dict = input("Enter your dict file name: ")
        if "dictionary" not in word_dict:
             word_dict = os.path.join(os.path.dirname(__file__), "dictionary", word_dict)
        with open(word_dict) as d:
            word_list = d.read().splitlines()
    
    word_list = clean_word_list(word_list)
    anagram_dict = create_anagram_dict(word_list)
    return word_list, anagram_dict

def clean_word_list(word_list: list[str]) -> list[str]:
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

def create_anagram_dict(word_list: list[str]) -> dict[tuple, list[str]]:
    anag_dict = defaultdict(list)
    for word in word_list:
        word_id = create_word_id(word)
        anag_dict[word_id].append(word)
    return anag_dict

def filter_len_word_list(min_length: int, max_length: int, word_list: list[str]) -> list[str]:
    filtered_list = [
        word for word in word_list if min_length <= len(word) <= max_length
    ]
    return filtered_list
