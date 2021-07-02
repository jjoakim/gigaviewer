import os
import pyvips
import tqdm
import shutil
import glob
import sys
import json

SEARCH_DIR = '/media/Friday/Data_backup/GigaZoom'
LOG_FILE = '/home/rapiduser/datalog.json'
INDEX_PATH = '/home/rapiduser/index.html'
BASE_PATH = '/home/rapiduser/base.js'

def line_prepender(filename, line):
  with open(filename, 'r') as f:
    content = f.read()
  with open(filename, 'w') as f:
    f.write(line.rstrip('\r\n') + '\n' + content)

def create_deepzoom_structure(target_folder):
  assert os.path.exists(os.path.join(target_folder, 'data.json'))
  with open(os.path.join(target_folder, 'data.json')) as fp:
    metadata = json.load(fp)
  base_folder = metadata['base_folder']
  if 'group' in metadata:
    group = metadata['group']
  else:
    group = "None"
  image_paths = [os.path.join(base_folder, f) for f in metadata['files']]
  data_folder = os.path.join('/home/rapiduser/auto', group, metadata['name'])
  # assert not os.path.exists(data_folder)
  os.makedirs(data_folder, exist_ok=True)
  tile_size = 256
  output_folders = []
  for image in tqdm.tqdm(image_paths):
    print("processing: ", image)
    output_folder_name = os.path.splitext(os.path.basename(image))[0]
    output_folder = os.path.join(data_folder, output_folder_name)
    output_folders.append(output_folder)
    os.makedirs(output_folder, exist_ok=False)
    image_path = image.replace(" ", "\\ ")
    out_path = output_folder.replace(" ", "\\ ")
    command = f'vips dzsave {image_path} {out_path} --suffix .jpg[Q=80]'
    print(command)
    os.system(command)
  # shutil.copy2(BASE_PATH, os.path.join(data_folder, 'movie.js'))
  # shutil.copy2(INDEX_PATH, os.path.join(data_folder, 'index.html'))
  # tileSources = [os.path.basename(of) + ".dzi" for of in output_folders]
  # line = "tileSources = " + str(tileSources) + ";"
  # line_prepender(os.path.join(data_folder, 'movie.js'), line)
  

if __name__ == "__main__":
  with open(LOG_FILE) as fp:
    log_data = json.load(fp)
  completed_folders = log_data['complete']
  target_folders = [os.path.dirname(f) for f in glob.glob(os.path.join(SEARCH_DIR, '*/data.json'))]
  target_folders = [t for t in target_folders if t not in completed_folders]
  if len(target_folders) == 0:
    print("All folders have already been processed")
    sys.exit()
  for target_folder in target_folders:
    create_deepzoom_structure(target_folder)
    log_data['complete'].append(target_folder)
    with open(LOG_FILE, 'w') as fp:
      json.dump(log_data, fp) 
