import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addFeatureImage,
    getFeatureImages,
} from "../../store/shop/common-slice/index";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null)
        setUploadedImageUrl("")
      }
    });
  }
  
  useEffect(() => {
      dispatch(getFeatureImages());
    }, [dispatch]);
    
    console.log(featureImageList);
    console.log(uploadedImageUrl);

  return (
    <>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="nt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col ">
        {featureImageList && featureImageList?.length > 0
          ? featureImageList.map((featureImage) => (
              <>
                <div className="relative">
                  {featureImage?.image ? (
                    <img
                      src={featureImage.image}
                      alt={featureImage?.title}
                      className="w-full h-[300px] object-cover rounded-t-lg mt-2"
                    />
                  ) : null}
                </div>
              </>
            ))
          : null}
      </div>
    </>
  );
}

export default AdminDashboard;
