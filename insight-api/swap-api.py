import insightface
from insightface.app import FaceAnalysis
from insightface.data import get_image as ins_get_image
import cv2
import os

current_dir = os.getcwd()

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0, det_size=(640, 640))
swapper = insightface.model_zoo.get_model(
    "inswapper_128.onnx", download=False, download_zip=False
)
print(swapper)

me_img = cv2.imread("major.png")
me_img_faces = app.get(me_img)
my_face = me_img_faces[0]


def swap_faces(image_path, src_face):
    res_img = cv2.imread(image_path)
    res_img_copy = res_img.copy()
    res_img_faces = app.get(res_img)
    for face in res_img_faces:
        res_img_copy = swapper.get(res_img_copy, face, src_face, paste_back=True)
    print(res_img_copy)
    return res_img_copy


def custom_swap():
    # src_path = os.path.join(current_dir, folder_path)
    dest_path = os.path.join(current_dir, "results")

    src_face1 = cv2.imread("ja.jpg")
    # src_face2 = cv2.imread("rawme.jpg")
    src_img_faces1 = app.get(src_face1)
    # src_img_faces2 = app.get(src_face2)
    face1 = src_img_faces1[0]
    # face2 = src_img_faces2[0]

    res_img = cv2.imread("scott.jpg")
    res_img_copy = res_img.copy()
    res_img_faces = app.get(res_img)
    res_img_copy = swapper.get(res_img_copy, res_img_faces[0], face1, paste_back=True)
    # res_img_copy = swapper.get(res_img_copy, res_img_faces[1], face2, paste_back=True)
    cv2.imwrite(os.path.join(dest_path, "custom1.jpg"), res_img_copy)


def swap_directory_faces(folder_path, src_face):
    src_path = os.path.join(current_dir, folder_path)
    dest_path = os.path.join(current_dir, "results")
    print()
    print(src_path)
    print(dest_path)
    print()
    for filename in os.listdir(src_path):
        if filename.endswith((".jpg", ".png", ".jpeg")):
            image_path = os.path.join(folder_path, filename)
            # image = cv2.imread(image_path)
            result_image = swap_faces(image_path, src_face)
            cv2.imwrite(os.path.join(dest_path, filename), result_image)


def swap_directory_faces_to_index(folder_path):
    src_path = os.path.join(current_dir, folder_path)
    dest_path = os.path.join(current_dir, "results")
    for filename in os.listdir(src_path):
        if filename.endswith((".jpg", ".png", ".jpeg")):
            # image = cv2.imread(image_path)
            image_path = os.path.join(folder_path, filename)
            res_img = cv2.imread(image_path)
            res_img_faces = app.get(res_img)
            result_image = swap_faces(image_path, res_img_faces[0])
            cv2.imwrite(os.path.join(dest_path, filename), result_image)


# swap_directory_faces("src_images", my_face)
swap_directory_faces_to_index("src_images")
# custom_swap()
