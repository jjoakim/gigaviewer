import string
import random
import os
from natsort import natsorted
import json
from operator import attrgetter

nb_char_tag = 4
start_dir = "auto"
max_depth = 4

# Create a string containing all uppercase letters and digits.
characters = string.ascii_uppercase + string.digits

# Convert the string to an array of characters.
character_array = list(characters)

nb_char = len(character_array)
# print("Number of unique tags possible", nb_char**nb_char_tag)

def generate_random_string(length=nb_char_tag):
  result = ''.join(random.choice(character_array) for i in range(length))
  return result

# random_string = generate_random_string()
# print(random_string)

def get_meta():
  try:
    f = open('meta.json')
    data = json.load(f)
    f.close()
    return data
  except:
    return {}

tags=[]

def list_dir(path=start_dir, depth=0):
  if depth == max_depth:
    return
  # if path.find("stitched") != -1 or path.startswith("height_map") or path.isnumeric():
  #   return {}
  
  print("Enter dir", path)
  os.chdir(path)

  obj={}
  # dir = os.scandir()
  dir = natsorted(os.scandir(),key=attrgetter("name"))

  groups = {}
  files = []
  
  for item in dir:
    # if ( os.path.isdir(item) ):
    if item.is_dir():
      res = list_dir(item.name, depth+1)
      if res:
        groups[item.name] = res
    elif item.name != "meta.json":
      files.append(item.name)
  
  if groups:
    obj["groups"] = groups
  if files:
    obj["files"] = files
  
  meta = get_meta()
  
  if "tag" in meta:
    obj["tag"] = meta["tag"]
    tags.append(meta["tag"])

  os.chdir("../")
  return obj

def list_dir_add_tag(obj, path=start_dir):
  if not obj:
    return
  # print("Enter dir", path)
  os.chdir(path)

  if "groups" in obj:
    for item in obj["groups"]:
      list_dir_add_tag(obj["groups"][item], item)
  
  if not "tag" in obj:
    obj["tag"] = createUniqueTag()
    meta = {"tag" : obj["tag"]}
    # with open("meta.json", "w") as file:
    #   file.write( json.dumps(meta) )
  
  os.chdir("../")


def createUniqueTag():
  tag = generate_random_string()
  while tag in tags:
    tag = generate_random_string()
  
  tags.append(tag)
  return tag

orig_path = os.getcwd()

obj = list_dir()
os.chdir(orig_path)
list_dir_add_tag(obj)
os.chdir(orig_path)

# print(obj)

print("Number of tags in use", len(tags), "of", nb_char**nb_char_tag)

with open("test.json", "w") as file:
  file.write( json.dumps(obj) )