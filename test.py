import string
import random
import os
from natsort import natsorted
import json


nb_char_tag = 4
start_dir = "auto"

# Create a string containing all uppercase letters and digits.
characters = string.ascii_uppercase + string.digits

# Convert the string to an array of characters.
character_array = list(characters)

nb_char = len(character_array)
print("Number of unique tags possible", nb_char**nb_char_tag)

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
  except:
    return {}

tags=[]

def list_dir(path=start_dir):
  print("Enter dir", path)
  os.chdir(path)

  obj={}
  dir = natsorted( os.listdir(".") )

  groups = {}
  files = []
  
  for item in dir:
    if ( os.path.isdir(item) ):
      groups[item] = list_dir(item)
    else:
      files.append(item)
  
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
  # print("Enter dir", path)
  os.chdir(path)

  if "groups" in obj:
    for item in obj["groups"]:
      list_dir_add_tag(obj["groups"][item], item)
  
  if not "tag" in obj:
    obj["tag"] = createUniqueTag()
  
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

print(obj)

with open("test.json", "w") as file:
  file.write( json.dumps(obj) )