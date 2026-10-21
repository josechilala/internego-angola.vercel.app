"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Images, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectPhoto } from "@/data/projects";

type ProjectPhotoGalleryProps = {
  photos: ProjectPhoto[];
  preview?: boolean;
  projectTitle: string;
};

export function ProjectPhotoGallery({
  photos,
  preview = false,
  projectTitle,
}: ProjectPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visiblePhotos = preview ? photos.slice(0, 3) : photos;
  const activePhoto = activeIndex === null ? undefined : photos[activeIndex];

  useEffect(() => {
    if (activeIndex !== null && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [activeIndex]);

  function changePhoto(direction: -1 | 1) {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || photos.length < 2) return currentIndex;
      return (currentIndex + direction + photos.length) % photos.length;
    });
  }

  function closeViewer() {
    if (dialogRef.current?.open) dialogRef.current.close();
    setActiveIndex(null);
  }

  return (
    <>
      <div className={`project-photo-grid${preview ? " project-photo-grid--preview" : ""}`}>
        {visiblePhotos.map((photo, index) => (
          <button
            className="project-photo"
            key={`${photo.src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Ampliar fotografia ${index + 1} de ${photos.length} de ${projectTitle}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              unoptimized
              sizes={preview ? "(max-width: 760px) 90vw, 35vw" : "(max-width: 760px) 90vw, 33vw"}
              className="project-photo__image"
            />
            <span className="project-photo__zoom"><Images aria-hidden="true" size={16} /></span>
            {preview && index === visiblePhotos.length - 1 && photos.length > visiblePhotos.length && (
              <span className="project-photo__more">+{photos.length - visiblePhotos.length} fotografias</span>
            )}
            {photo.caption && <span className="project-photo__caption">{photo.caption}</span>}
          </button>
        ))}
      </div>

      {activePhoto && (
        <dialog
          className="project-viewer"
          ref={dialogRef}
          aria-label={`Fotografias do projeto ${projectTitle}`}
          onCancel={() => setActiveIndex(null)}
          onClose={() => setActiveIndex(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
        >
          <button className="project-viewer__close" type="button" onClick={closeViewer} aria-label="Fechar fotografia">
            <X aria-hidden="true" size={21} />
          </button>
          {photos.length > 1 && (
            <button
              className="project-viewer__arrow project-viewer__arrow--previous"
              type="button"
              onClick={() => changePhoto(-1)}
              aria-label="Fotografia anterior"
            >
              <ArrowLeft aria-hidden="true" size={21} />
            </button>
          )}
          <figure className="project-viewer__figure">
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              unoptimized
              sizes="(max-width: 760px) 94vw, 82vw"
              className="project-viewer__image"
            />
            {activePhoto.caption && <figcaption>{activePhoto.caption}</figcaption>}
          </figure>
          {photos.length > 1 && (
            <button
              className="project-viewer__arrow project-viewer__arrow--next"
              type="button"
              onClick={() => changePhoto(1)}
              aria-label="Fotografia seguinte"
            >
              <ArrowRight aria-hidden="true" size={21} />
            </button>
          )}
          <p className="project-viewer__count">{activeIndex !== null ? activeIndex + 1 : 1} / {photos.length}</p>
        </dialog>
      )}
    </>
  );
}