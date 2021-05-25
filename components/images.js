import React, { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useQueryClient
} from "react-query";
import imageBoxStyles from "../styles/ImageBox.module.css";
import homeStyles from "../styles/Home.module.css"

export default function ImageBox({ image1, image2, setImage1, setImage2 }) {
    const [image, setImage] = useState(-1);
    const [category, setCategory] = useState("ex: Frank's Red Hot Sauce");
  
    const onBackClick = () => {
      setImage(-1);
    };
    const checkStyle = {
      fontSize: '22px',
      lineHeight: '50%',
      color: 'rgba(96, 191, 161, 1)',
      textShadow: 'rgba(96, 191, 161, 1)',
      display: image1 && image2 ? 'inline' : 'none'
    }
  
    return (
      <div className={homeStyles.container}>
        {image > -1 ? (
          <Lightbox
            onBackClick={onBackClick}
            image={image}
            setImage={setImage}
            setImage1={setImage1}
            setImage2={setImage2}
            category={category}
          />
        ) : null}
        <h3>Step 2: Select Images<span style={checkStyle}> &#x2713;</span></h3>
        <div className={imageBoxStyles.nav}>
          <ImageSearch setCategory={setCategory} category={category} />
          <p>NOTE: square images display best</p>
        </div>
        <Images
          setImage={setImage}
          category={category}
        />
      </div>
    );
  }

function ImageSearch({ setCategory, category }) {
    const [focus, setFocus] = useState(false);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      event.target.elements.category.blur();
      if (category) {
        setCategory(event.target.elements.category.value);
      }
    };
  
    const boxStyle = {
      color: "rgb(170, 170, 170)"
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Search for an image:</label>
        <input
          id="category"
          name="category"
          defaultValue={category}
          onFocus={(event) => {
            event.target.value = "";
            setFocus(true);
          }}
          onBlur={(event) => {
            if (!event.target.value) {
              event.target.value = category;
              if (category === "ex: Frank's Red Hot Sauce") setFocus(false);
            }
          }}
          style={focus ? null : boxStyle}
        />
      </form>
    );
  }

  function Images({ setImage, category }) {
    const url = new URL("https://www.googleapis.com/customsearch/v1");
  
    const queryParams = {
      key: process.env.NEXT_PUBLIC_SEARCH_ENGINE_API_KEY,
      cx: process.env.NEXT_PUBLIC_SEARCH_ENGINE_ID,
      searchType: "image",
      q:
        category === "ex: Frank's Red Hot Sauce"
          ? "Frank's Red Hot Sauce"
          : category,
    };
  
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value);
    }

    const { 
      isLoading, 
      data,
      error,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage } = useInfiniteQuery(category, 
        async ({ pageParam = 0 }) => {
          const res = await fetch(url + "&start=" + (pageParam * 10 + 1));
          return res.json();
        }, {
      getNextPageParam: () => data ? (data.pageParams.length > 1 ? data.pageParams.slice(-1)[0] + 1 : 1) : 1//pageNum + 1
    })

    if (isLoading) return  <div className={imageBoxStyles["images-container"]}>Loading...</div>;
    if (error) return <div className={imageBoxStyles["images-container"]}>{"An error has occurred: " + error.message}</div>;

    const handleClick = () => {
      fetchNextPage()
    }
    return (
      <>
        <div className={imageBoxStyles["images-container"]}>
        {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.items.map((item, itemIndex) => (
                <div key={`${itemIndex}-${item.title}`} className={imageBoxStyles["image-box"]}>
                <img
                  className={imageBoxStyles.thumbnails}
                  src={item.link}
                  alt={item.title}
                  onClick={() => setImage(pageIndex * 10 + itemIndex)}
                />
              </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <button 
          onClick={handleClick}
          className={imageBoxStyles.button}
          disabled={!hasNextPage || isFetchingNextPage}
          >
            { hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </>
    );
  }

  function Lightbox({ onBackClick, image, setImage, setImage1, setImage2, category }) {
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData(category);
    const page = Math.floor(image/10);
    const num = image % 10;
    const queryItem = data.pages[page].items[num];
  
    const nextImage = () => {
      setImage(Math.min(data.pages.length*10 - 1, image + 1));
    };
  
    const previousImage = () => {
      setImage(Math.max(0, image - 1));
    };
  
    const handleKey = (event) => {
      if (event.keyCode === 27 || event.keyCode === 8) {
        onBackClick();
      }
      if (event.keyCode === 37) {
        previousImage();
      }
      if (event.keyCode === 39) {
        nextImage();
      }
    };
  
    const onBackgroundClick = (event) => {
      if (event.target.className === "lightbox-container") {
        onBackClick();
      }
    };
  
    useEffect(() => {
      document.addEventListener("keydown", handleKey);
      return () => {
        document.removeEventListener("keydown", handleKey);
      };
    });

    const handleClick = (event) => {
      if (event.target.id === "1") {
        setImage1(queryItem);
        onBackClick();
      } else {
        setImage2(queryItem);
        onBackClick();
      }
    }
  
    return (
      <div className={imageBoxStyles["lightbox-container"]} onClick={onBackgroundClick}>
        <div className={imageBoxStyles.lightbox}>
          <button 
          type="button"
          className={imageBoxStyles.exit} 
          onClick={event => {
            event.target.focus();
            onBackClick();
          }}>
            &#x2715;
          </button>
          <button
          type="button"
          className={`${imageBoxStyles["switch-photo"]} ${imageBoxStyles.previous} ${image > 0 ? null : imageBoxStyles.disabled}`}
          onClick={event => {
            event.target.focus();
            previousImage();
          }}
          >
            &#60;
          </button>
          <button
          type="button"
          className={`${imageBoxStyles["switch-photo"]} ${imageBoxStyles.next} ${image < data.pages.length*10 - 1 ? null : imageBoxStyles.disabled}`}
          onClick={event => {
            event.target.focus();
            nextImage();
          }}
          >
            &#62;
          </button>
          <div className={imageBoxStyles.bigImageContainer}>
            <img
              className={imageBoxStyles.bigImage}
              src={queryItem.link}
              alt={queryItem.title}
            />
          </div>
          <div className={imageBoxStyles["image-selection"]}>
            <button id="1" className={imageBoxStyles["choose-image"]} onClick={handleClick}>Set as first image</button>
            <button id="2" className={imageBoxStyles["choose-image"]} onClick={handleClick}>Set as second image</button>
          </div>
        </div>
      </div>
    );
  }