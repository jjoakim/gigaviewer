import json
import os
import glob
from natsort import natsorted
import shutil
from distutils.dir_util import copy_tree
import cv2 as cv
import numpy as np

GV_BASE_URL = 'https://gigazoom.rc.duke.edu/'

def get_path_from_url(url):
    return os.path.join('/home/rapiduser/', url[len(GV_BASE_URL):])

def make_url(path):
    return os.path.join(GV_BASE_URL, path)

def make_composite(image_paths):
    images = [cv.imread(image_path) for image_path in image_paths]
    composite = np.zeros((300,300,3), dtype=np.uint8)
    if len(images) == 0:
        raise RuntimeError()
    elif len(images) == 1:
        composite = cv.resize(images[0], (300, 300))
    elif len(images) == 2:
        composite = cv.resize(images[0], (300, 300))
        composite[:, 150:] = cv.resize(images[1], (300, 300))[:, 150:]
    elif len(images) == 3:
        composite[:150, :150] = cv.resize(images[0], (150, 150))
        composite[:, 150:] = cv.resize(images[1], (300, 300))[:, 150:]
        composite[150:, :150] = cv.resize(images[2], (150, 150))
    else:
        composite[:150, :150] = cv.resize(images[0], (150, 150))
        composite[:150, 150:] = cv.resize(images[1], (150, 150))
        composite[150:, :150] = cv.resize(images[2], (150, 150))
        composite[150:, 150:] = cv.resize(images[3], (150, 150))
    return composite

def generate_group(base_dir, author='Horstmeyer Lab'):
    dzi_files = natsorted(glob.glob(os.path.join(base_dir, '*.dzi')))
    meta_path = os.path.join(base_dir, 'metadata.json')
    if os.path.exists(meta_path):
        with open(meta_path) as fp:
            meta = json.load(fp)
    else:
        meta = {}
    if 'height' in meta:
        height = meta['height']
    else:
        height = 0.07424
    if 'folder' in meta:
        folder = meta['folder']
    else:
        folder = None
    gid = os.path.basename(base_dir)
    if gid == '':
        gid = os.path.basename(os.path.dirname(base_dir))
    # HARDCODING FOR NOW
    title = gid
    source_type = 'Visible'
    idx = 0
    description = title
    # thumbnail is the first decent sized image of the first dzi
    thumbnail_folder = os.path.splitext(dzi_files[0])[0] + "_files"
    pyramid_folders = natsorted(glob.glob(os.path.join(thumbnail_folder, '*/')))[::-1]
    # now iterate backwards until there is only a single file in the folder
    for pf in pyramid_folders:
        images = glob.glob(os.path.join(pf, '*.*'))
        if len(images) == 1:
            break
    thumbnail_image = images[0]
    
    group_data = {
        'gid': gid,
        'title': title,
        'author': author,
        'thumbnailImg': make_url(thumbnail_image),
        'description': description,
        'idx': idx,
        'folder': False,
        'height': height,
        'sources': [
            {
                'type': source_type,
                'tileSources': [make_url(dzi_file) for dzi_file in dzi_files]
            }
        ]
    }
    
    return group_data

if __name__ == "__main__":
    # get the valid folders
    valid_folders = [f for f in glob.glob(os.path.join('auto', '*/')) if not any(['dzi' in ff for ff in os.listdir(f)])]
    print(valid_folders)
    all_group_data = {}
    for valid_folder in valid_folders:
        targets = glob.glob(os.path.join(valid_folder, '*/'))
        target_name = os.path.basename(valid_folder[:-1])
        
        print(target_name)
        group_list = [generate_group(target) for target in targets]
        groups = {group['gid'] : group for group in group_list}
        if target_name == 'None':
            all_group_data.update(groups)
        else:
            folder_data = {'folder': True}
            folder_data['author'] = 'Horstmeyer Lab'
            folder_data['description'] = target_name
            folder_data['title'] = target_name
            # Making the composite
            target_image_paths = [get_path_from_url(group['thumbnailImg']) for group in groups.values()]
            composite_image = make_composite(target_image_paths)
            thumb_img_path = os.path.join('auto', f'{target_name}-thumbnail.jpg').replace(' ', '-')
            cv.imwrite(thumb_img_path, composite_image)
            folder_data['thumbnailImg'] = make_url(thumb_img_path)
            folder_data['groups'] = groups
            all_group_data[target_name] = folder_data

    json_data = {
        "groups": all_group_data
    }
    with open('image_manifest.json', 'w') as fp:
        json.dump(json_data, fp)
        
    shutil.copy2('image_manifest.json', '/home/rapiduser/gigaviewer/gigaviewer-ui/src/components/image-viewer/imageMetadata.json')
    os.system('yarn --cwd /home/rapiduser/gigaviewer/gigaviewer-ui/ build')
    copy_tree('/home/rapiduser/gigaviewer/gigaviewer-ui/build/', '/var/www/html/')
