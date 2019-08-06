def slowest_replace(orignal_str):
    replace_list = []
    for i, char in enumerate(orignal_str):
        c = char if char != " " else "-"
        replace_list.append(c)

    return "".join(replace_list)


def slow_replace(orignal_str):
    replace_str = ""
    for i, char in enumerate(orignal_str):
        c = char if char != " " else "-"
        replace_str += c
    return replace_str


def fast_replace(orignal_str):
    return "-".join(orignal_str.split())


def fastest_replace(orignal_str):
    return orignal_str.replace(" ", "-")
