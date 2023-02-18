import json
import os
import glob
from natsort import natsorted
import shutil
from distutils.dir_util import copy_tree
# import cv2 as cv
import numpy as np

GV_BASE_URL = 'https://gigazoom.rc.duke.edu/'

def get_path_from_url(url):
    # return os.path.join('~', url[len(GV_BASE_URL):])
    return url

def make_url(path):
    # return os.path.join(GV_BASE_URL, path)
    return path

# def make_composite(image_paths):
#     images = [cv.imread(image_path) for image_path in image_paths]
#     print(image_paths[0:4])
#     composite = np.zeros((300,300,3), dtype=np.uint8)
#     if len(images) == 0:
#         raise RuntimeError()
#     elif len(images) == 1:
#         composite = cv.resize(images[0], (300, 300))
#     elif len(images) == 2:
#         composite = cv.resize(images[0], (300, 300))
#         composite[:, 150:] = cv.resize(images[1], (300, 300))[:, 150:]
#     elif len(images) == 3:
#         composite[:150, :150] = cv.resize(images[0], (150, 150))
#         composite[:, 150:] = cv.resize(images[1], (300, 300))[:, 150:]
#         composite[150:, :150] = cv.resize(images[2], (150, 150))
#     else:
#         composite[:150, :150] = cv.resize(images[0], (150, 150))
#         composite[:150, 150:] = cv.resize(images[1], (150, 150))
#         composite[150:, :150] = cv.resize(images[2], (150, 150))
#         composite[150:, 150:] = cv.resize(images[3], (150, 150))
#     return composite

def generate_group(base_dir):
    with open(os.path.join(base_dir, 'order.json')) as fp:
        order_data = json.load(fp)['order']
    dzi_files = [os.path.join(base_dir, of) for of in order_data]
    dzi_files_short = [of for of in order_data]
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
    gid = os.path.basename(base_dir)
    if gid == '':
        gid = os.path.basename(os.path.dirname(base_dir))
    # HARDCODING FOR NOW
    title = gid
    source_type = 'Visible'
    idx = 0
    thumbnail_folder = os.path.splitext(dzi_files[0])[0] + "_files"
    pyramid_folders = natsorted(glob.glob(os.path.join(thumbnail_folder, '*/')))[::-1]
    # now iterate backwards until there is only a single file in the folder
    for pf in pyramid_folders:
        images = glob.glob(os.path.join(pf, '*.*'))
        if len(images) == 1:
            break
    try:
        thumbnail_image = images[0]
        thumbnail_image = thumbnail_image.split(title)[-1][1:]
    except:
        raise Exception('Problematic directory: ' + base_dir)
        
    group_data = {
        'gid': gid,
        'title': title,
        'thumbnailImg': make_url(thumbnail_image),
        'idx': idx,
        'kind': 'capture',
        'height': height,
        'sources': [
            {
                'type': source_type,
                'tileSources': dzi_files_short
            }
        ]
    }
    
    return group_data

if __name__ == "__main__":
    manifest_data = {}
    # first get the team folders
    teams = glob.glob(os.path.join('auto', '*/'))
    print("teams: ", teams)
    manifest_data = {"groups": {}}
    for team in teams:
        team_data = {'groups': {}, 'kind': 'team'}
        team_data['title'] = os.path.basename(team[:-1])
        # then get the projects
        projects = glob.glob(os.path.join(team, '*/'))
        print("projects: ", projects)
        for project in projects:
            project_data = {'groups': {}, "kind": "project"}
            project_name = os.path.basename(project[:-1])
            project_data['title'] = project_name
            captures = glob.glob(os.path.join(project, '*/'))
            print("captures: ", captures)
            for capture in captures:
                capture_data = generate_group(capture)
                capture_name = capture_data['title']
                project_data['groups'][capture_name] = capture_data
            groups = project_data['groups']
            # make the composite image for the project
            target_image_paths = [get_path_from_url(group['thumbnailImg']) for group in groups.values()]
            # composite_image = make_composite(target_image_paths)
            thumb_img_path = os.path.join(project, f'{project_name}-thumbnail.jpg')
            # print("writing thumb to", thumb_img_path)
            # cv.imwrite(thumb_img_path, composite_image)
            project_data['thumbnailImg'] = f'{project_name}-thumbnail.jpg' #make_url(thumb_img_path)
            team_data['groups'][project_name] = project_data
        # lazily grabbing the last thumbnail image
        team_data['thumbnailImg'] = f'{project_name}/{project_name}-thumbnail.jpg'#thumb_img_path
        manifest_data['groups'][team_data['title']] = team_data

    with open('image_manifest.json', 'w') as fp:
        json.dump(manifest_data, fp)

    # shutil.copy2('image_manifest.json', '/home/kk349/gigaviewer/gigaviewer-ui/src/components/image-viewer/imageMetadata.json')
    # os.system('yarn --cwd /home/kk349/gigaviewer/gigaviewer-ui/ build')
    # copy_tree('/home/kk349/gigaviewer/gigaviewer-ui/build/', '/var/www/html/')